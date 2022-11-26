import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { FiUpload } from "react-icons/fi";

import styles from "./styles.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState<File>();
  const [categories, setCategories] = useState(categoryList || []);
  const [cateogrySelected, setCategorySelected] = useState(0);
  const [nameItem, setNameItem] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];
    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(parseInt(event.target.value));
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      const data = new FormData();

      if (
        nameItem === "" ||
        price === "" ||
        description === "" ||
        imageAvatar === null ||
        imageAvatar === undefined
      ) {
        toast.warning("Preencha todos os campos!");
        return;
      }

      data.append("name", nameItem);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[cateogrySelected].id);
      data.append("file", imageAvatar ?? "");

      const apiClient = setupAPIClient();

      await apiClient.post("/product", data);

      toast.success("Cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Ops, erro ao cadastrar!");
    }

    setNameItem("");
    setPrice("");
    setDescription("");
    setImageAvatar(undefined);
    setAvatarUrl("");
  }

  return (
    <>
      <Head>
        <title>Novo produto - Sujeito Pizzaria</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Novo Produto</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={30} color="#FFF" />
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFile}
              />

              {avatarUrl && (
                <Image
                  className={styles.preview}
                  src={avatarUrl}
                  alt="Foto do produto"
                  width={250}
                  height={250}
                />
              )}
            </label>
            <select value={cateogrySelected} onChange={handleChangeCategory}>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <input
              type="text"
              placeholder="Digite o nome do produot"
              className={styles.input}
              value={nameItem}
              onChange={(e) => setNameItem(e.target.value)}
            />
            <input
              type="text"
              placeholder="Preço do produot"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
              placeholder="Descreva seu produto..."
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/category");

  return {
    props: {
      categoryList: response.data,
    },
  };
});

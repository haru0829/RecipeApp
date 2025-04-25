// addRecipe.js
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const recipe = {
  image: "/images/code.png",
  id: "7",
  title: "全くの初心者でもOK！2週間でWebサイトをつくって公開しよう",
  purpose:
    "自分でHTML/CSSを書いて、GitHub PagesなどでWebサイトを公開できるようになる",
  duration: "2週間",
  people: "780",
  tag: ["html", "css", "github", "web制作"],
  description:
    "全くプログラミングに触れたことのない人でもパソコンさえあれば簡単に始められるレシピです。Progateなどの初学者用の学習サイトを利用し基礎知識をつけた後に、既存サイトの模写を行い、最終的にオリジナルサイトの公開まで行います。このレシピを完璧にこなすことでweb制作に関する基本的な流れやコーディングについて学ぶことができます。",
  steps: [
    {
      title: "HTMLとCSSをProgateで学ぼう",
      tasks: [
        "Progateと検索し、アカウント登録を行う",
        "「HTML&CSS」コースの初級編を受講する",
        "「HTML&CSS」コースの中級編を受講する",
        "「HTML&CSS」コースの上級編を受講する",
      ],
      point:
        "✅Point：まずは基本的なマークアップ言語であるHTMLとCSSについてProgateという学習サイトで学びます。ずっと使っていく大切な知識となりますので、確実に学んでいきましょう。（道場レッスンは飛ばしてOK）",
    },
    {
      title: "Codejumpを利用し、サイトの模写をしてみよう",
      tasks: [
        "Codejumpと検索し、「入門編:プロフィールサイト」の模写をしよう。",
      ],
      point:
        "💡Point：Codejumpとは既にあるサイトを真似して自分で設計してみる、「サイト模写」の練習にぴったりなサイトです。このステップで先ほど得た知識のアウトプットを行っていきます。",
    },
    {
      title: "自分で作ったサイトを公開してみよう",
      tasks: [
        "githubでアカウント登録をする",
        "制作したファイルをアップロードし、公開する",
      ],
      point:
        "💡Point：公開するまでがサイト制作なので、しっかりgithubの知識も身に着けていきましょう。",
    },
  ],
};

export const addRecipeToFirestore = async () => {
  try {
    const docRef = await addDoc(collection(db, "recipes"), recipe);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

import Head from 'next/head';

type Props = {
  title: string;
  description?: string;
  image?: string;
};

const Metatags = ({ title, description, image }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
};

export default Metatags;

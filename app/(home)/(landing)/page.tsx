import Hero from './hero';
import ContentProduct from './content-product';

// TODO
export default async function Landing() {
  return (
    <main className="no-scrollbar overflow-y-auto w-screen h-screen">
      <Hero />

      <ContentProduct />
    </main>
  );
}

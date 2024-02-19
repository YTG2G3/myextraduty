import Hero from './hero';
import ContentProduct from './content-product';

// TODO
export default async function Landing() {
  return (
    <main className="no-scrollbar h-screen w-screen overflow-y-auto">
      <Hero />

      <ContentProduct />
    </main>
  );
}

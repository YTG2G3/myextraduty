import swagger from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
    const spec = await swagger();

    return (
        <section className="container">
            <ReactSwagger spec={spec} />
        </section>
    );
}
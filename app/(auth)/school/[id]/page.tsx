export default function School({ params }: { params: { id: string } }) {
    return (
        <div>PA {params.id}</div>
    );
}
export default function HeadingSmall({ title, description }: { title: string; description?: string }) {


    return (
        <header className="capitalize">
            <h3 className="mb-0.5 text-base font-medium">{title}</h3>
            {description && <p className="capitalize text-sm text-muted-foreground">{description}</p>}
        </header>
    );
}

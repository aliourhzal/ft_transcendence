export default function Container(props: any) {
    return (
        <div className={`p-5 bg-darken-100 rounded-xl gap-5 ${props.className}`}>{props.children}</div>
    );
}
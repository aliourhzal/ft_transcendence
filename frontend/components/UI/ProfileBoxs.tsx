export default function Container(props: any) {
    return (
        <div className={`${props.className} p-5 bg-slate-700 rounded-xl flex flex-col gap-5`}>{props.children}</div>
    );
}
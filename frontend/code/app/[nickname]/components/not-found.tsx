import Link from "next/link";

export default function NotFound({nickname}) {
	return (
		<div className="text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
			<span className="text-lg font-medium">User not Found</span>
			<Link href={`/${nickname}`} className="py-2 px-4 bg-blueStrong rounded-xl font-medium">Go Home</Link>
		</div>
	);
}
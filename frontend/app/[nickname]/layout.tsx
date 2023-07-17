import SideBar from "./components/sideBar";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
        <section className='w-full flex h-screen'>
           <SideBar />
           {children}
        </section>
    );
}
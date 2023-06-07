
import ProfileInfo from "./ProfileInfo";

export default function ProfileContent() {
    return(
        <section className='w-11/12 flex items-center justify-center gap-5'>
            <ProfileInfo />
            <div className="flex flex-col">
            <div style={{gridArea: '1 / 2 / 2 / 3'}} className=' bg-red-600'>helo</div>
            <div style={{gridArea: ' 2 / 2 / 3 / 3'}} className='bg-blue-500'>hello</div>
            </div>
        </section>
    );
}
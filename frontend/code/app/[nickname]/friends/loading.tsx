import './style.css'

export default function loading()
{
    return (
        <div className=' bg-darken-200 w-full h-full overflow-auto flex justify-center items-center'>
            <div className="wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
            </div>
        </div>
    );
}
import { conversation } from "../page"
import UserBox from "./ConvBox"
// import { useContext } from "react"
// import { Context } from "../page"

interface ConvListProps {
  items: conversation[]
};

const ConvList: React.FC<ConvListProps> = ({items}) => {
    // const {showConv, setShowConv, activeUserConv, setActiveUserConv} = useContext(Context)
    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {items.map ((item:conversation) =>  (<UserBox key={item.id} data={item} />))}
      </div>
    )
  }

  export default ConvList
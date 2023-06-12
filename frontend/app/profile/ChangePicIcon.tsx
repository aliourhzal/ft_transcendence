'use client'

import { ChangeEventHandler } from "react";
import {CgArrowsExchangeV} from "react-icons/cg"

interface ModifyIcon {
    inputId: string,
    changePicFunc: ChangeEventHandler,
    className: string
}

export default function ChangePicIcon(props: ModifyIcon) {
	return (
		<label htmlFor={props.inputId} className={`${props.className}`}>
			<CgArrowsExchangeV className="text-white text-[30px] rounded-full bg-darken-100/50 backdrop-blur-sm hover:cursor-pointer"/>
			<input type="file" id={props.inputId} className="hidden" onChange={props.changePicFunc}/>
		</label>
	);
}
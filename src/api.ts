import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.DEV ?  "https://polyton.daytona-project.com/api/v1" : "https://whalepad.daytona-project.com/api/v1/"
})

export const authApi = axios.create({
	baseURL: import.meta.env.DEV ?  "https://polyton.daytona-project.com/api/v1/auth/" : "https://whalepad.daytona-project.com/api/v1/",
	headers: {
		'init-data': window.Telegram.WebApp.initData
	}
})

export const toncenter = axios.create({
	baseURL: import.meta.env.DEV ? `https://toncenter.com/api/v3` : `https://toncenter.com/api/v3`
})
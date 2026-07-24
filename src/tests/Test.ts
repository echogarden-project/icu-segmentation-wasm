import * as ICUSegmantation from '../exports/Exports.js'
import { Timer } from '../utilities/Timer.js'

const log = console.log

async function test() {
	const { readFile } = await import('fs/promises')
	//const text = await readFile('test-data/Alice.txt', 'utf-8')

	const text = `
	南国名城
	侨乡新会
	新会古称“冈州”
	地处珠江三角洲西部
	这里全年四季分明
	气候温和
	雨量充沛
	被评为广东省最美的生态乡村
	江门市美和食品有限公司
	是一家集新会柑种植
	陈皮茶生产加工和仓储陈化于一体的
	新会陈皮全产业链经营企业
	从田间管理到采摘要求和运输时效
	均遵从科学的工艺流程
	和严谨的质量管理标准
	达到并获得国际标准产品标志证书认可
	为保证消费者安全放心使用
	每批产品上市前送达国家检测部门
	检测零农残达标方出品
	凭借自主研发的糅合发酵技术
	新会陈皮和新会柑普茶
	从2015年致今
	在中国深圳国际茶产业博览会茶王赛
	名茶评比中大放异彩
	屡获殊荣
	特别金奖、金奖等
	震撼业界
	公司旗下的“柑随香”品牌
	将始终秉承匠心制茶的理念
	肩负高度的使命感为
	新会陈皮和茶产业发展不断发力
	传承经典的同时不忘创造经典
	一步一脚印
	稳扎实打
	广结天下茶客
	促进茶文化、茶科技
	茶产业统筹发展
	积极探索新时代
	“三茶”融合发展新思路
	开创茶产业高质量发展新征程
	`

	const langauge = ''

	const timer = new Timer()

	await ICUSegmantation.initialize()

	timer.logAndRestart('Initialize')

	//const words = ICUSegmantation.splitToWords('Hello  Mr. Smith. How are you doing today?', langauge)
	const words = ICUSegmantation.splitToWords(text, langauge)

	timer.logAndRestart('Process')

	//log(JSON.stringify(words))

	const x = 0
}

let wasmInstance: any

export async function getWasmModule() {
	if (!wasmInstance) {
		const { default: initializer } = await import('../../wasm/icu-segmentation.js')

		wasmInstance = await initializer()
	}

	return wasmInstance
}

test()

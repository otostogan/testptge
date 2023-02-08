import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../components/some'), {
	ssr: false,
})

export default function Home() {
	return (
	<div>
		<DynamicHeader/>
	</div>
	)
}



import type { NextPage } from 'next'
import {Table} from "../components/Table";
import {CreateBetBtn} from "../components/CreateBetBtn";

const Home: NextPage = () => {
  return (
    <div className='relative'>
        <div className='justify-center items-center mx-auto'>
            <Table />
        </div>
    </div>
  )
}

export default Home

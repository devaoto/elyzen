import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });

const DMCA = () => {
  return (
    <>
      <SideBar />
      <div className='mx-auto max-w-2xl px-4 py-20'>
        <h1 className='mb-4 font-mono text-4xl'>DMCA NOTE</h1>
        <p className='mb-56 text-primary-200 text-lg'>
          Elyzen operates independently and is not formally associated with
          nor endorsed by any of the anime studios responsible for the creation
          of the anime featured on this platform. Our website serves solely as a
          user interface, facilitating access to self-hosted files sourced from
          various third-party providers across the internet. It&apos;s important
          to note that Elyzen never initiates downloads of video content from
          these providers. Instead, links are provided in response to user
          requests, thereby absolving the platform from any potential DMCA
          compliance issues.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default DMCA;






export default function Offline() {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold lg:text-7xl'>You are offline</h1>
      <p className='text-xl font-semibold lg:text-2xl'>
        Connect to internet and try again
      </p>
    </div>
  );
}

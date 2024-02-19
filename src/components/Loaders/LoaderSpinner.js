
import { Grid, TailSpin, ThreeDots } from 'react-loader-spinner';

export const LoaderGrid = () => {
  return (
    <Grid
      visible={true}
      height="80"
      width="80"
      color="#C0B7B1"
      ariaLabel="grid-loading"
      radius="12.5"
      wrapperStyle={{}}
      wrapperClass="grid-wrapper"
    />
  );
};

export const LoaderThreeDots = () => {
  return (
    <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="#C0B7B1"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  )
}

export const LoaderTailSpin = () => {
  return (
    <TailSpin
      visible={true}
      height="80"
      width="80"
      color="#C0B7B1"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '30vh', 
      }}
      wrapperClass=""
    />
  )
}
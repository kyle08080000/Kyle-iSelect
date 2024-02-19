import { BarLoader, HashLoader, PropagateLoader, PulseLoader, RiseLoader, RotateLoader, SquareLoader, SyncLoader } from 'react-spinners';

export const LoaderRotateLoader = ({ loading }) => (
  <div 
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
  >
    <RotateLoader
      size={"30px"} 
      color={"#C0B7B1"} 
      loading={loading}
      margin={25} 
      speedMultiplier={1.5} 
      cssOverride={{
        display: 'block',
        margin: '0 auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

export const LoaderPropagateLoader = ({ loading }) => (
  <div 
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
  >
    <PropagateLoader
      size={"30px"} 
      color={"#C0B7B1"} 
      loading={loading}
      margin={10} 
      speedMultiplier={1} 
      cssOverride={{
        display: 'block',
        margin: '0 auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

export const LoaderPulseLoader = ({ loading }) => (
  <div
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
  >
    <PulseLoader
      size={"10px"} 
      color={"#C0B7B1"} 
      loading={loading}
      margin={10} 
      speedMultiplier={1} 
      cssOverride={{
        display: 'block',
        margin: '0 auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

export const LoaderSquareLoader = ({ loading }) => (
  <div
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
  >
    <SquareLoader
      size={"100px"} 
      color={"#C0B7B1"} 
      loading={loading}
      // margin={10} 
      speedMultiplier={1.5} 
      cssOverride={{
        display: 'block',
        margin: '0 auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

export const LoaderRiseLoader = ({ loading }) => (
  <div
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', height: '80vh' }}
  >
    <RiseLoader
      size={"20px"} 
      color={"#C0B7B1"} 
      loading={loading}
      // margin={10} 
      speedMultiplier={1.5} 
      cssOverride={{
        display: 'block',
        margin: '50px auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

export const LoaderHashLoader = ({ loading }) => (
  <div
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', height: '80vh' }}
  >
    <HashLoader
      size={"100px"} 
      color={"#C0B7B1"} 
      loading={loading}
      // margin={10} 
      speedMultiplier={1.5} 
      cssOverride={{
        display: 'block',
        margin: '50px auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

// 
export const LoaderBarLoader = ({ loading }) => (
  <div
    className="loader-container" 
    style={{ display: 'flex', justifyContent: 'center', }}
  >
    <BarLoader
      size={"20px"} 
      color={"#C0B7B1"} 
      loading={loading}
      // margin={10} 
      speedMultiplier={1} 
      cssOverride={{
        display: 'block',
        margin: '50px auto',
      }} 
    />
  </div>
);

export const LoaderDotLoader = ({ loading }) => (
  <div
    className="loader-container" 
    style={{ 
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh',
    }}
    
  >
    <SyncLoader
      size={"50px"} 
      color={"#C0B7B1"} 
      loading={loading}
      margin={10} 
      speedMultiplier={1.5} 
      cssOverride={{
        display: 'block',
        margin: '100px auto',
        borderColor: 'red',
      }} 
    />
  </div>
);

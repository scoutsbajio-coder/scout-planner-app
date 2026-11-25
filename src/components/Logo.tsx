import { asset } from '../utils/asset';

export default function Logo({ size = 36 }: { size?: number }) {
  return <img src={asset('icons/icon.svg')} width={size} height={size} alt="" />;
}

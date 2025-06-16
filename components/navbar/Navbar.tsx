import CartButton from "../../components/buttons/CartButton";
import DropdownProfile from "../../components/dropdowns/DropdownProfile";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar({ balance }: { balance: number }) {
  const { currentUser } = useAuth();
  return (
    <div className="flex justify-between items-center px-6 py-2 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow">
      <div className="flex items-center gap-4">
        <CartButton />
        <span className="text-xl">${balance.toFixed(2)}</span>
      </div>
      <div className="text-end">
        <h1 className="text-2xl font-bold">Halo,</h1>
        <DropdownProfile />
      </div>
    </div>
  );
}

import CartButton from "../../components/buttons/CartButton";
import DropdownProfile from "../../components/dropdowns/DropdownProfile";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-2 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow">
      <CartButton />
      <div className="text-end">
        <h1 className="text-2xl font-bold">Halo,</h1>
        <DropdownProfile />
      </div>
    </div>
  );
}

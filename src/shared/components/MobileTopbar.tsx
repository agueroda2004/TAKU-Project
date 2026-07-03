import UserMenu from "./UserMenu";

export default function MobileTopbar() {
  return (
    <header className="font-comfortaa sticky top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-secondary px-4 shadow-sm md:hidden">
      <span className="text-base font-bold tracking-wide text-primary">
        TAKU-Project
      </span>
      <UserMenu />
    </header>
  );
}
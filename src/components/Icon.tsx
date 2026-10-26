export default function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      {name}
    </span>
  );
}

/* eslint-disable-next-line */
export interface FooterColumnProps {
  data: { id: number; title: string }[];
  title: string;
}

export function FooterColumn({ data, title }: FooterColumnProps) {
  return (
    <div>
      <h3 className="mb-4 text-2xl dark:text-gray-400">{title}</h3>
      {data.map((item) => (
        <p className="my-3 font-sans text-md" key={item.id}>
          {item.title}
        </p>
      ))}
    </div>
  );
}

export default FooterColumn;

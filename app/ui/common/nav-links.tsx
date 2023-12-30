import LinkItem from "./linkitem";

export type LinkProps = {
  name: string;
  href: string;
  icon: (props: any) => JSX.Element;
};

export function NavLinks({ links }: { links: LinkProps[]}) {
  return (
    <>
      {links.map((link, index) => {
        const LinkIcon = link.icon;
        return (
          <LinkItem key={index} name={link.name} href={link.href}>
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </LinkItem>
        );
      })}
    </>
  );
}
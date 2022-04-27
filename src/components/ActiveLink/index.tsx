import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps{
    children: ReactElement,
    activeClassName: string,
}

export function ActiveLink ({ children, activeClassName, ...rest }: ActiveLinkProps ) {
    const { asPath } = useRouter();

    const className = asPath === rest.href ? activeClassName : '';

    children.props
    return (
        <Link {...rest}>
            {cloneElement(children, {className})}
        </Link>
    )
}
import * as React from 'react'
import styled from "styled-components";


const NavbarScroller = (props: {
    brand: { name: string; to: string },
    links: Array<{ name: string, to: string }>
}) => {
    const {brand, links} = props;
    const NavLinks: any = () => links.map((link: { name: string, to: string }) => <Li key={link.name}><a
        href={link.to}>{link.name}</a></Li>);
    return (
        <Navbar>
            <Brand href={brand.to}>{brand.name}</Brand>
            <Ul>
                <NavLinks/>
            </Ul>
        </Navbar>
    )
}

const Theme = {
    colors: {
        bg: `#fff`,
        dark: `rgba(2, 8, 20, 0.1)`,
        light: `#EEEEEE`,
        red: `#ff5851`,
    },
    fonts: {
        body: `Noto Sans, sans-serif`,
        heading: `Noto Sans, sans-serif`,
    }
}

const Navbar = styled.nav`
  background: ${Theme.colors.dark};
  font-family: ${Theme.fonts.heading};
  color: ${Theme.colors.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: large;
  }`;

const Brand = styled.a`
  font-weight: bold;
  font-style: italic;
  margin-left: 1rem;
  padding-right: 1rem;`;

const Ul = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;`;

const Li = styled.li`
  flex: 0 0 auto;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  -webkit-tap-highlight-color: transparent;
  align-items: center;
  color: #999;
  height: 30px;
  justify-content: center;
  text-decoration: none;
  display: flex;
  font-size: 14px;
  line-height: 16px;
  margin: 0 10px;
  white-space: nowrap;`;

export default NavbarScroller

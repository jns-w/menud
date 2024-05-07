# Menu'd: A Seamless Mobile Web Menu Experience

Github: [github.com/jns-w/menud](https://github.com/jns-w/menud)\
Demo site: [menud.jonaswong.dev](https://menud.jonaswong.dev)
![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709716896/Devsite/menu-d/Menud-main_er3jpg.png)

> #### Frontend Stack:
>
> - React
> - Vite
> - Sass
>
> #### Backend Stack:
>
> - Golang
> - Gin
> - PostgresSQL

Navigating digital menus in restaurants can often be a frustrating experience for customers. Many of these websites are designed as typical web pages retrofitted for mobile devices, resulting in confusing layouts and tiny buttons. When using these menus, **I often find myself missing the seamless experience I enjoy in dedicated mobile apps**.

### Goals

The primary goal of this project is to create a website that delivers **an app-like experience on a mobile browser**, ensuring a smooth and intuitive user experience. To achieve this, the following design requirements were established:

> #### Design requirements
>
> - Large touch points for site navigation
> - Seamless page transitions, allowing better route sensing for the user
> - Reactive UI with conditional components (e.g., carts, item counts)

![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709717699/Devsite/menu-d/Menud-UIs_oleoer.png)

![](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1709713276/Devsite/menu-d/menud-comp2_dbmopr.gif)

Set your browser to mobile dev mode and go to the [demo](https://menud.jonaswong.dev) to experience it!

## Database design structure

Menu data is served using a golang server, with PostgresSQL as the database of choice. I have chosen to keep this simple, and not use any abstracted ORMs, opting for [SQLx](https://github.com/launchbadge/sqlx#). Designed for long-term maintainability, the menu's data is separated into categories and joined via IDs when fetched; allowing reusability and adjustments to the menu in the future.

![Menu'd Models](https://res.cloudinary.com/ds1s8ilcc/image/upload/v1706846307/Devsite/menu-d/menud-models_mo73h7.png)
Thank you for reading! If you're interested, do check out my next project [Nothing To Do](https://github.com/jns-w/nothing), built with React Native.

<div align="center">
  <h1><a href="https://npm.im/remix-auth-totp">💡 Remix Client Hints</a></h1>
  <p>
    A simple and straightforward <strong>Remix + Client Hints</strong> example based on <a href="https://github.com/epicweb-dev/epic-stack/blob/main/docs/client-hints.md">Epic Stack - Client Hints</a> implementation, that provides <strong>Light/Dark Theme & Server Dates</strong> in your application.
  </p>
  <!-- <br /><br /> -->
  <div>
    <a href="https://remix-client-hints.fly.dev">Live Demo</a>
    •
    <a href="https://github.com/dev-xo/remix-client-hints/tree/main#resources">Resources</a>
  </div>
</div>

## [Live Demo](https://remix-client-hints.fly.dev)

[Live Demo](https://remix-client-hints.fly.dev) that displays Theme Switching and Server Dates in action.

[![Remix Auth TOTP](https://raw.githubusercontent.com/dev-xo/dev-xo/main/remix-client-hints/thumbnail.png)](https://remix-client-hints.fly.dev)

## Remix + Client Hints API

This example isn't meant to be a full-fledged application; it's more a reference for your own implementation or a starting point for your own project.

It helps you implement Theme Switching and Server Dates, based on [Epic Stack - Client Hints](https://github.com/epicweb-dev/epic-stack/blob/main/docs/client-hints.md) and [Jacob Paris](https://www.jacobparis.com/content/remix-ssr-dates) article.

On the first visit, the server grabs theme and time-zone hints, stores them in cookies, and reloads the page for client-side usage. While the **_FOUC (Flash of Unstyled Content)_** is unavoidable, the one-time page reload is a good trade-off and provides a better user experience than having the flash occur on every page load.

Check out the [Resources](#resources) section for more info and examples on Client Hints.

## Usage

Let's review some implementation details.

### `Theme Switching`

Theme switching is based on `prefers-color-scheme` media feature, which is a part of the [User Preference Media Features](https://web.dev/articles/user-preference-media-features-headers) specification.

To update our theme, we do a `POST` request to `/resources/theme` route, that updates the `theme` cookie, and either reloads the page **_(Progressive Enhancement)_** or returns a JSON response.

### `Time-Zone`

The time-zone implementation allows the server to understand client's time zone on initial page load. On the server-side, the `getHints(request).timeZone` method is used to retrieve the time-zone information. For client-side usage, `useHints().timeZone` could be employed.

In the App Demo, the time-zone is also displayed in the UI, and the `Intl.DateTimeFormat` object is created in the user's time-zone, considering their preferred language.

## Getting Started

In order to run this example locally, clone the repository and install its dependencies:

```sh
npm install
```

Run the server:

```sh
npm run dev
```

Ready to go! 🎉

## Resources

A list of examples and resources that could help you grasp the concepts behind Client Hints and this implementation.

- [HTTP Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) - A must-read introduction to Client Hints by MDN Web Docs.
- [Media features Client Hints](https://web.dev/articles/user-preference-media-features-headers) - A great article that discusses how client hint headers can help websites obtain user media preferences like color scheme or reduced motion at request time, enabling servers to deliver optimized CSS for better performance.
- [Server Dates with Remix](https://www.jacobparis.com/content/remix-ssr-dates) by [Jacob Paris](https://twitter.com/jacobmparis) - One of the first Remix articles that discusses how to handle date rendering in Remix apps when the server and client are in different timezones, avoiding issues like flash of unstyled content (FOUC) and hydration problems. A similar approach has later been used as base implementation for the Epic Stack - Client Hints.
- [FOUC (Flash of Unstyled Content)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) - A great Wikipedia article that discusses the FOUC issue.
- [Epic Stack - Client Hints](https://github.com/epicweb-dev/epic-stack/blob/main/docs/decisions/005-client-pref-cookies.md) by [kentcdodds](https://github.com/kentcdodds) - An introduction to Client Hints + Remix, that has served as a base for this implementation.

## Contributing

If you have any suggestions you'd like to share, feel free to open a PR!

## License

Licensed under the [MIT license](https://github.com/dev-xo/remix-auth-totp/blob/main/LICENSE).

import { useState } from "react";
import { VideosPage } from "./components/videosPage.jsx";
import { HomePage } from "./components/homePage.jsx";
import { AuthPage } from "./components/auth.jsx";
import { TweetsPage } from "./components/tweetPage.jsx";
import { ChannelPage } from "./components/channelPage.jsx";
import "./App.css";

function App() {
  return (
    <>
      <HomePage />
      <AuthPage />
      {/* <VideosPage /> */}
      <TweetsPage />
      <ChannelPage />
    </>
  );
}

export default App;

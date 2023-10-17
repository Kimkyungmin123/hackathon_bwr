"use client";
import { createUser } from "@/apis";
import { analytics, auth } from "@/config/firebase";
import useUserStore from "@/store";
import { UserType } from "@/types";
import { usePathname, useRouter } from "next/navigation";

import {
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously,
  signInWithCredential,
  User as TFirebaseUser,
} from "firebase/auth";

import { useEffect, useState } from "react";
import Login from "../Login";
import { Header } from "antd/es/layout/layout";
import { Menu } from "antd";
import { logEvent } from "firebase/analytics";
const HeaderLayout = () => {
  const { uid, name, email, setUser } = useUserStore();
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  useEffect(() => {
    if (pathname === "/write") {
      if (!name) {
        alert("로그인 후 사용가능합니다.");
        router.push("/restaurant-list");
      }
    }
  }, [pathname, name]);
  useEffect(() => {
    if (name) return;

    signInAnonymously(auth)
      .then((info) => {
        const { uid } = info.user;
        setUser(uid, "", "");
      })
      .catch((error) => {
        console.error(error.code);
        throw error.message;
      });
  }, [setUser, uid, name]);

  const logout = () => {
    auth.signOut().then(() => setUser("", "", ""));
    router.push("/");
  };

  const onLinkedSns = (user: TFirebaseUser) => {
    const data: UserType = {
      uid: user.uid as string,
      email: user.email as string,
      name: user.providerData[0].displayName as string,
    };

    createUser(data)
      .then((res) => {
        setUser(uid as string, name as string, email as string);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const googleLogin = () => {
    const originalUser = auth.currentUser;

    if (!originalUser) return;
    const googleProvider = new GoogleAuthProvider();

    linkWithPopup(originalUser, googleProvider)
      .then((res) => {
        onLinkedSns(res.user);
      })
      .catch((err) => {
        if (
          err.code === "auth/credential-already-in-use" ||
          err.code === "auth/email-already-in-use"
        ) {
          const credential = GoogleAuthProvider.credentialFromError(err);
          if (!credential) return;
          signInWithCredential(auth, credential)
            .then((res) => {
              setUser(
                res.user.uid,
                res.user.providerData[0].displayName as string,
                res.user.email as string
              );
              router.push("/restaurant-list");
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    logEvent(analytics, "google_login");
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "#fafafa",
      }}
    >
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className="text-6xl font-bold">개발팀 맛집 게시판</h1>

          {isClient && (
            <div className="flex items-center space-x-4">
              <span className="text-blue" style={{ font: "bold" }}>
                {name && `${name}님 `}
              </span>
              <Login
                userName={name as string}
                googleLogin={googleLogin}
                logout={logout}
              >
                {name ? "로그아웃" : "구글 로그인"}
              </Login>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderLayout;

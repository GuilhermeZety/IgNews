//next-auth
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

//icon
import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"

//scss
import styles from './styles.module.scss'

export function SignInButton() {
    const { status, data } = useSession();
      
    return status == 'authenticated' ? (
        <button type="button" className={styles.signInButton} >
            <FaGithub color="#84d361"/>  
            {data.user.name}
            <FiX className={styles.x} onClick={() => signOut()} />
        </button>
    ) : (
        <button type="button" onClick={() => signIn('github')} className={styles.signInButton}>
            <FaGithub color="#eba417"/>  Sign in with Github
        </button>
    )
}
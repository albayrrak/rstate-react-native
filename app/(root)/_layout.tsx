import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/providers/global-provider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, Slot } from 'expo-router'

const AppLayout = () => {

    const { loading, isLoggedIn } = useGlobalContext()

    if (loading) {
        return (
            <SafeAreaView className='bg-white h-full flex justify-center items-center'>
                <ActivityIndicator size="large" className='text-primary-300' />
            </SafeAreaView>
        )
    }

    if (!isLoggedIn) return <Redirect href="/sign-in" />

    return <Slot />
}

export default AppLayout
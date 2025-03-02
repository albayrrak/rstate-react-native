import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { settings } from '@/constants/data'
import { useGlobalContext } from '@/providers/global-provider'
import { logout } from '@/lib/appwrite'

interface ISettingsItemProps {
    icon: ImageSourcePropType,
    title: string,
    onPress?: () => void,
    textStyle?: any,
    showArrow?: boolean
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: ISettingsItemProps) => {
    return (
        <TouchableOpacity onPress={onPress} className='flex flex-row justify-between items-center py-4'>
            <View className='flex flex-row items-center gap-3'>
                <Image source={icon} className='size-6' />
                <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
            </View>
            {showArrow && <View>
                <Image source={icons.rightArrow} className='size-5' />
            </View>}
        </TouchableOpacity>
    )
}


const Profile = () => {
    const { refetch, user } = useGlobalContext()

    const handleLogout = async () => {
        const result = await logout()

        if (result) {
            Alert.alert("Success", "Logged out successfully")
            refetch()
        } else {
            Alert.alert("Error", "Failed to logout")
        }
    }

    return (
        <SafeAreaView className='bg-white h-full'>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='pb-32 px-7'>
                <View className='flex flex-row items-center justify-between mt-5'>
                    <Text className='text-xl font-rubik-bold'>Profile</Text>
                    <Image source={icons.bell} className='size-5' />
                </View>
                <View className='flex-row justify-center flex mt-5'>
                    <View className='flex flex-col items-center relative rounded-full'>
                        <Image source={{ uri: user?.avatar }} className='size-44 relative rounded-full' />
                        <TouchableOpacity className='absolute bottom-11 right-2'>
                            <Image source={icons.edit} className='size-9' />
                        </TouchableOpacity>
                        <Text className='text-2xl font-rubik-bold mt-2'>
                            {user?.name}
                        </Text>
                    </View>
                </View>
                <View className='flex flex-col mt-10'>
                    <SettingsItem icon={icons.calendar} title='My Bookings' />
                    <SettingsItem icon={icons.wallet} title='Payments' />
                </View>
                <View className='flex flex-col mt-5 border-t pt-5'>
                    {settings.slice(2).map((item, index) => (
                        <SettingsItem key={index} icon={item.icon} title={item.title} />
                    ))}
                </View>

                <View className='flex flex-col mt-5 border-t pt-5'>
                    <SettingsItem onPress={handleLogout} textStyle='text-danger' icon={icons.logout} title={"Logout"} showArrow={false} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile
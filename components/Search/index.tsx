import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import icons from '@/constants/icons'
import { useDebouncedCallback } from 'use-debounce'

const Search = () => {

    const path = usePathname()
    const params = useLocalSearchParams<{ query?: string }>()
    const router = useRouter()

    const [search, setSearch] = React.useState(params.query || '')

    const debouncedSearch = useDebouncedCallback((text: string) => {

        return router.setParams({ query: text })
    }, 500)

    const handleSeach = (text: string) => {
        setSearch(text)
        debouncedSearch(text)
    }

    return (
        <View className='flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2'>
            <View className='flex-1 flex flex-row items-center justify-start z-50'>
                <Image source={icons.search} className='size-5' />
                <TextInput
                    value={search}
                    onChangeText={handleSeach}
                    placeholder='Search for anything'
                    className='text-sm font-rubik text-black-300 ml-2 flex-1'
                />
                <TouchableOpacity>
                    <Image source={icons.filter} className='size-5' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Search
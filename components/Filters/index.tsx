import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { categories } from '@/constants/data'

const Filters = () => {
    const params = useLocalSearchParams<{ filter?: string }>()
    const [selectedCategory, setSelectedCategory] = React.useState(params.filter || 'All')

    const handleCategory = (category: string) => {

        if (selectedCategory === category) {
            setSelectedCategory("All")
            router.setParams({ filter: "All" })
            return
        }
        setSelectedCategory(category)
        router.setParams({ filter: category })
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-3 mb-2'>

            {categories.map((item, index) => (
                <TouchableOpacity onPress={() => handleCategory(item.category)} className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === item.category ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`} key={index}>
                    <Text className={`text-sm ${selectedCategory === item.category ? "text-white font-rubik-bold mt-0.5" : "text-primary-300"}`}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

export default Filters
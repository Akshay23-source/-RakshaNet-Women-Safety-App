import React, { useState } from 'react'
import { Search, Play, Clock, Youtube } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

// Self-defense video data with real YouTube video IDs
const selfDefenseVideos = [
  {
    id: 1,
    title: 'Basic Self Defense for Women',
    description: 'Essential techniques every woman should know',
    category: 'Basic Defense',
    duration: '8:45',
    youtubeId: 'KVpxP3ZZtAc',
    isShort: false,
    tags: ['basic self defense', 'beginner']
  },
  {
    id: 2,
    title: 'Self Defense Techniques - Quick Tips',
    description: 'Quick and effective self defense moves',
    category: 'Basic Defense',
    duration: '0:59',
    youtubeId: 'WGVvw7DdlPY',
    isShort: true,
    tags: ['basic self defense', 'quick defense']
  },
  {
    id: 3,
    title: 'Martial Arts for Women',
    description: 'Powerful martial arts techniques for self protection',
    category: 'Martial Arts',
    duration: '10:30',
    youtubeId: 'k9Jn0eP-ZVg',
    isShort: false,
    tags: ['martial arts women', 'karate', 'self protection']
  },
  {
    id: 4,
    title: 'Women Self Defense - Martial Arts',
    description: 'Essential martial arts moves every woman should know',
    category: 'Martial Arts',
    duration: '0:45',
    youtubeId: 'KrPqHQ5ZTTQ',
    isShort: true,
    tags: ['martial arts women', 'self defense techniques']
  },
  {
    id: 5,
    title: 'Martial Arts Training for Women',
    description: 'Complete martial arts training program',
    category: 'Martial Arts',
    duration: '12:15',
    youtubeId: 'HJuyLkoAdhc',
    isShort: false,
    tags: ['martial arts women', 'training', 'combat']
  },
  {
    id: 6,
    title: 'Self Defense Against Attacks',
    description: 'Defend yourself against common attacks',
    category: 'Defense Techniques',
    duration: '0:58',
    youtubeId: 'lVDcVHtnv5A',
    isShort: true,
    tags: ['self defense', 'attack defense']
  },
  {
    id: 7,
    title: 'Women Self Defense Training',
    description: 'Comprehensive self defense training for women',
    category: 'Training',
    duration: '14:20',
    youtubeId: 'u-70AYN_v8Y',
    isShort: false,
    tags: ['self defense', 'women training', 'protection']
  },
  {
    id: 8,
    title: 'Self Defense Moves',
    description: 'Effective self defense moves and techniques',
    category: 'Defense Techniques',
    duration: '11:45',
    youtubeId: 'KsnDrNqFX3w',
    isShort: false,
    tags: ['defense moves', 'self protection', 'techniques']
  },
  {
    id: 9,
    title: 'Boxing Training for Women',
    description: 'Boxing fundamentals for fitness and defense',
    category: 'Boxing',
    duration: '12:30',
    youtubeId: 'eUW1YMd_XV8',
    isShort: false,
    tags: ['boxing women', 'boxing training']
  },
  {
    id: 10,
    title: 'Escape Techniques',
    description: 'How to escape from grabs and holds',
    category: 'Escape Methods',
    duration: '10:15',
    youtubeId: 'T7aNSRoDCmg',
    isShort: false,
    tags: ['escape techniques', 'grab defense']
  },
  {
    id: 11,
    title: 'Pressure Points Defense',
    description: 'Effective pressure points for self defense',
    category: 'Advanced',
    duration: '9:20',
    youtubeId: 'dOOFmpWJTTs',
    isShort: false,
    tags: ['pressure points', 'advanced techniques']
  },
  {
    id: 12,
    title: 'Krav Maga for Women',
    description: 'Combat and defense techniques',
    category: 'Advanced',
    duration: '18:45',
    youtubeId: 'XQu8TTBmGhA',
    isShort: false,
    tags: ['krav maga', 'combat training']
  },
  {
    id: 13,
    title: 'Street Fighting Techniques',
    description: 'Real-world self defense scenarios',
    category: 'Street Defense',
    duration: '14:20',
    youtubeId: 'iZ5fZRzewU4',
    isShort: false,
    tags: ['street fighting', 'real world defense']
  },
  {
    id: 14,
    title: 'Boxing Women Fundamentals',
    description: 'Proper boxing stance and punches',
    category: 'Boxing',
    duration: '11:05',
    youtubeId: 'nT1z2FJzAEI',
    isShort: false,
    tags: ['boxing women', 'fundamentals']
  }
]

const quickSearches = [
  'basic self defense',
  'martial arts women',
  'boxing women',
  'krav maga',
  'escape techniques',
  'pressure points',
  'street fighting'
]

export function SelfDefense() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredVideos, setFilteredVideos] = useState(selfDefenseVideos)

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredVideos(selfDefenseVideos)
      return
    }

    const filtered = selfDefenseVideos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredVideos(filtered)
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = selfDefenseVideos.filter(video => 
      video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      video.title.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredVideos(filtered)
  }

  const openYouTubeVideo = (youtubeId: string, isShort: boolean = false) => {
    const url = isShort 
      ? `https://youtube.com/shorts/${youtubeId}`
      : `https://www.youtube.com/watch?v=${youtubeId}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Youtube className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">Self Defense Video Search</h2>
        </div>
        <p className="text-sm text-gray-600">
          Search for specific self-defense techniques and get video results
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for self defense techniques (e.g., 'basic self defense', 'martial arts', 'escape techniques')..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-red-600 hover:bg-red-700 px-6"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Videos
        </Button>
      </div>

      {/* Quick Searches */}
      <div className="space-y-2">
        <p className="text-sm">Quick searches:</p>
        <div className="flex flex-wrap gap-2">
          {quickSearches.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(query)}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Access Videos Section */}
      <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-600" />
          <h3 className="text-purple-900">Quick Access Videos</h3>
        </div>
        <p className="text-sm text-purple-700">
          Popular self defense videos for quick learning
        </p>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredVideos.slice(0, 6).map((video) => (
            <Card 
              key={video.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-purple-100"
            >
              <div className="p-4 space-y-3">
                {/* Video Title */}
                <div>
                  <h4 className="line-clamp-2 min-h-[3rem]">{video.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Category and Duration */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    {video.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Watch Button */}
                <Button
                  onClick={() => openYouTubeVideo(video.youtubeId, video.isShort)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Videos
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No videos found for "{searchQuery}". Try different search terms.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setFilteredVideos(selfDefenseVideos)
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Show All Videos Button */}
        {filteredVideos.length > 6 && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Showing 6 of {filteredVideos.length} videos
            </p>
          </div>
        )}
      </div>

      {/* Additional Videos Section (if more than 6) */}
      {filteredVideos.length > 6 && (
        <div className="space-y-4">
          <h3>More Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.slice(6).map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden hover:shadow-md transition-shadow bg-white"
              >
                <div className="p-4 flex gap-4 items-center">
                  <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                    <Youtube className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-grow space-y-2">
                    <h4 className="line-clamp-1">{video.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                      <span className="text-xs text-gray-600">{video.duration}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => openYouTubeVideo(video.youtubeId, video.isShort)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Youtube className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Important:</strong> Videos will open in a new tab on YouTube. 
              Make sure to practice these techniques with proper supervision and training.
            </p>
            <p className="text-xs text-gray-600">
              These videos are curated from verified self-defense instructors and martial arts experts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

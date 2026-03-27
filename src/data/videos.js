export const videos = [
  {
    id: 1,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: { name: "nature_vibes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature" },
    description: "The beauty of nature never gets old 🌿✨ #Nature #Relaxing #Aesthetic",
    likes: 24800, comments: 312, shares: 890,
    music: "Chill Lofi Beats - nature_vibes",
  },
  {
    id: 2,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    user: { name: "ocean_dreamer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ocean" },
    description: "Lost in the waves 🌊 therapy hits different #Ocean #Peaceful",
    likes: 58200, comments: 741, shares: 2100,
    music: "Ocean Waves - ocean_dreamer",
  },
  {
    id: 3,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    user: { name: "city_pulse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=city" },
    description: "City lights hit differently at night 🌃 #CityLife",
    likes: 31400, comments: 528, shares: 1340,
    music: "Urban Nights - city_pulse",
  },
  {
    id: 4,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    user: { name: "ai_learner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ai" },
    description: "How transformers actually work 🤖 #AI #DeepLearning",
    likes: 1240, comments: 89, shares: 45,
    music: "Original Audio - ai_learner",
  },
  {
    id: 5,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    user: { name: "sky_chaser", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sky" },
    description: "Golden hour never disappoints 🌅 #Sunset #Photography",
    likes: 89300, comments: 1203, shares: 4500,
    music: "Golden Hour - sky_chaser",
  },
];

export const formatCount = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000)     return (num / 1_000).toFixed(1) + "K";
  return String(num);
};
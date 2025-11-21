"use client";

import { useState } from "react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: "Announcement" | "News" | "Event" | "Policy";
  date: string;
  author: string;
  image?: string;
  featured: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Taraba State Launches Free Education Initiative for Primary Schools",
    excerpt: "The state government has announced a comprehensive free education program aimed at improving access to quality education for all children.",
    content: "The Taraba State Government, under the leadership of His Excellency, has launched a groundbreaking free education initiative that will benefit thousands of primary school students across the state. This program includes free textbooks, uniforms, and meals for students in public primary schools.",
    category: "Announcement",
    date: "2024-01-15",
    author: "Ministry of Education",
    featured: true,
  },
  {
    id: 2,
    title: "New Healthcare Facility Opens in Wukari",
    excerpt: "A state-of-the-art healthcare center has been commissioned to serve the healthcare needs of residents in Wukari and surrounding communities.",
    content: "The new healthcare facility features modern equipment, qualified medical personnel, and 24-hour emergency services. This development is part of the state's commitment to improving healthcare accessibility.",
    category: "News",
    date: "2024-01-12",
    author: "Ministry of Health",
    featured: true,
  },
  {
    id: 3,
    title: "Agricultural Support Program for Farmers",
    excerpt: "The state government has rolled out a new agricultural support program providing seeds, fertilizers, and training to local farmers.",
    content: "This initiative aims to boost agricultural productivity and food security in Taraba State. Farmers can register for the program through the portal.",
    category: "Policy",
    date: "2024-01-10",
    author: "Ministry of Agriculture",
    featured: false,
  },
  {
    id: 4,
    title: "Road Construction Project Update",
    excerpt: "Progress update on the ongoing road construction projects across major highways in the state.",
    content: "Several road construction projects are nearing completion, which will significantly improve transportation and connectivity across Taraba State.",
    category: "News",
    date: "2024-01-08",
    author: "Ministry of Works",
    featured: false,
  },
  {
    id: 5,
    title: "Public Notice: Tax Payment Deadline Extension",
    excerpt: "The deadline for tax payments has been extended to provide more time for citizens to complete their obligations.",
    content: "In consideration of current economic conditions, the state government has extended the tax payment deadline. Citizens are encouraged to take advantage of this extension.",
    category: "Announcement",
    date: "2024-01-05",
    author: "TSIRS",
    featured: false,
  },
  {
    id: 6,
    title: "Upcoming: State Economic Summit 2024",
    excerpt: "Taraba State will host an economic summit to discuss investment opportunities and economic development strategies.",
    content: "The summit will bring together investors, policymakers, and stakeholders to explore opportunities for economic growth and development in Taraba State.",
    category: "Event",
    date: "2024-01-03",
    author: "Ministry of Commerce",
    featured: false,
  },
];

const categoryColors = {
  Announcement: "bg-blue-100 text-blue-800",
  News: "bg-green-100 text-green-800",
  Event: "bg-purple-100 text-purple-800",
  Policy: "bg-orange-100 text-orange-800",
};

export function NewsList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Announcement", "News", "Event", "Policy"];

  const filteredNews = newsItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  const featuredNews = filteredNews.filter((item) => item.featured);
  const regularNews = filteredNews.filter((item) => !item.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-taraba-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-taraba-green" />
            <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-taraba-green to-taraba-green-dark flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{item.title.charAt(0)}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[item.category]}`}
                    >
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {item.author}</span>
                    <Link
                      href={`/news/${item.id}`}
                      className="text-taraba-green hover:text-taraba-green-dark font-medium flex items-center gap-1"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
        <div className="space-y-6">
          {regularNews.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 h-32 bg-gradient-to-br from-taraba-green to-taraba-green-dark rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl font-bold">{item.title.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[item.category]}`}
                    >
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {item.author}</span>
                    <Link
                      href={`/news/${item.id}`}
                      className="text-taraba-green hover:text-taraba-green-dark font-medium flex items-center gap-1"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No news items found in this category.</p>
        </div>
      )}
    </div>
  );
}


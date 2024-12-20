import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaPlayCircle, FaPodcast, FaExternalLinkAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import Header from '../components/layout/Header';
import defaultProfile from '../assets/default-profile.png';

const ResourceView = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);

  // Helper function to clean text content
  const cleanTextContent = (text) => {
    if (!text) return '';
    return text
      .replace(/\\n/g, '\n')  // Replace \n with actual line breaks
      .replace(/\\r/g, '')    // Remove \r
      .replace(/\\/g, '')     // Remove remaining backslashes
      .trim();               // Remove extra whitespace
  };

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const link = `/api/resources/get_resource?resource_id=${resourceId}`
        const response = await fetch(link);
        const data = await response.json();

        if (data.success) {
          setResource(data.resource);
          if (data.resource.type === 'article') {
            // Parse content string
            const content = data.resource.content_json;
            const sections = content.split('||');
            const parsed = {
              introduction: cleanTextContent(sections.find(s => s.startsWith('INTRO:'))?.replace('INTRO:', '') || ''),
              paragraphs: sections
                .filter(s => s.startsWith('PARA:'))
                .map(p => cleanTextContent(p.replace('PARA:', ''))),
              conclusion: cleanTextContent(sections.find(s => s.startsWith('CONC:'))?.replace('CONC:', '') || '')
            };
            setParsedContent(parsed);
          } else {
            // For video/podcast, parse description
            const description = cleanTextContent(data.resource.content_json.replace('DESC:', ''));
            setParsedContent({ description });
          }
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching resource');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [resourceId]);

  const renderArticleContent = () => (
    <div className="space-y-8 font-oldstandard text-lg">
      {/* Introduction */}
      <div className="prose max-w-none">
        <div className="text-[#313131] leading-relaxed text-lg whitespace-pre-line">
          {parsedContent.introduction}
        </div>
      </div>

      {/* Main Paragraphs */}
      <div className="space-y-6">
        {parsedContent.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[#313131] leading-relaxed whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Conclusion */}
      <div className="prose max-w-none border-t border-[#E8D8D0] pt-6">
        <h3 className="text-xl font-medium text-[#2C3E50] mb-4 font-poppins">Conclusion</h3>
        <div className="text-[#313131] leading-relaxed text-lg whitespace-pre-line">
          {parsedContent.conclusion}
        </div>
      </div>
    </div>
  );

  const renderVideoContent = () => (
    <div className="space-y-6">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={resource.external_url}
          title={resource.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
      <div className="prose max-w-none">
        <div className="text-[#666] leading-relaxed text-lg font-oldstandard whitespace-pre-line">
          {parsedContent.description}
        </div>
      </div>
      <a
        href={resource.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-[#7C9885] hover:text-[#6B8574] transition-colors font-delius"
      >
        <FaExternalLinkAlt className="mr-2" />
        Watch on Platform
      </a>
    </div>
  );

  const renderPodcastContent = () => (
    <div className="space-y-6">
      <div className="bg-[#F8F9FA] p-6 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <FaPodcast className="text-4xl text-[#7C9885]" />
          <div>
            <h3 className="font-poppins font-medium text-xl text-[#2C3E50]">Listen to Episode</h3>
          </div>
        </div>
        <a
          href={resource.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[#7C9885] hover:text-[#6B8574] transition-colors font-delius"
        >
          <FaPlayCircle className="mr-2" />
          Listen Now
        </a>
      </div>
      <div className="prose max-w-none">
        <div className="text-[#666] leading-relaxed text-lg font-oldstandard whitespace-pre-line">
          {parsedContent.description}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            {error || 'Resource not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-[#FFE5EC] to-[#E5F0FF] py-8">
        <Header />
        <div className="max-w-4xl mx-auto px-4 pt-8">
          {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#666] hover:text-[#7C9885] mb-6 font-poppins"
        >
          <FaArrowLeft className="mr-2" />
          Back to Resources
        </button>

        {/* Resource Content */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#E8D8D0]">
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#666] mb-4 font-delius">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-950" />
                {format(new Date(resource.created_at), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <FaEye className="mr-2 text-pink-800" />
                {resource.view_count} views
              </div>
              {resource.author_name && (
                <div className="flex items-center">
                  <FaUser className="mr-2 text-green-900" />
                  {resource.author_name}
                </div>
              )}
              {resource.is_featured ? (
                <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-xs font-poppins">
                  Featured
                </span>
              ): <span></span>}
            </div>
            <h1 className="text-3xl font-serif text-[#2C3E50] mb-4">
              {cleanTextContent(resource.title)}
            </h1>
          </div>

          {/* Thumbnail for Articles */}
          {resource.thumbnail && (
            <div className="relative h-[400px] overflow-hidden">
              <img
                // `/api/get_image/${resource.thumbnail}`
                src={resource.thumbnail ? `/api/get_image/${resource.thumbnail}` : defaultProfile}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {resource.type === 'article' && renderArticleContent()}
            {resource.type === 'video' && renderVideoContent()}
            {resource.type === 'podcast' && renderPodcastContent()}
          </div>

          {/* Footer */}
          <div className="p-6 bg-[#FDF8F5] border-t border-[#E8D8D0]">
            <div className="flex items-center justify-between text-sm text-[#666] font-delius">
              <div>
                Last updated: {format(new Date(resource.updated_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </>
  );
};

export default ResourceView;

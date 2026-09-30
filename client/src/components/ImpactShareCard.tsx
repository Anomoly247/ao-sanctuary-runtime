import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Heart } from "lucide-react";
import ShareModal from "./ShareModal";
import { trpc } from "@/lib/trpc";

interface ImpactShareCardProps {
  metric: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function ImpactShareCard({
  metric,
  value,
  description,
  icon = <Heart className="w-8 h-8" />,
  color = "#ff00c8",
}: ImpactShareCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: shareData } = trpc.sharing.generateImpactShareUrls.useQuery({
    metric,
    value,
    description,
  });

  return (
    <>
      <Card className="bg-[#141423] border border-[#08080f] p-6 hover:border-[#ff00c8] transition-colors group">
        <div className="flex items-start justify-between mb-4">
          <div style={{ color }} className="opacity-80 group-hover:opacity-100">
            {icon}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowShareModal(true)}
            className="text-[#cccccc] hover:text-[#ff00c8]"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-4xl font-bold mb-2" style={{ color }}>
          {value}
        </p>
        <p className="text-[#00eaff] font-bold mb-3">{metric}</p>
        <p className="text-[#cccccc] text-sm mb-4">{description}</p>

        <Button
          onClick={() => setShowShareModal(true)}
          className="w-full bg-[#d8ae55] hover:bg-[#d8ae55]/80 text-white font-bold"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share This Impact
        </Button>
      </Card>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`${metric}: ${value}`}
          description={description}
          shareUrls={shareData.urls}
          shareUrl={shareData.card.shareUrl}
        />
      )}
    </>
  );
}

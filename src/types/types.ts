interface ICreatorNFT {
    rank: string;
    address: string;
    color: string;
}

interface IVote {
    title: string;
    collected: string;
    members: number;
}


export interface IEvent {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    creator: string;
    creator_nft: ICreatorNFT;
    votes: Record<"v1" | "v2", IVote>;
    expires_at: string;
    created_at: string;
    status: string;
    collectedAmount: string;
    category: string[];
    demoVotes: {
        v1: number;
        v2: number;
    };
    myDemoVote: 'v1' | 'v2' | null;
    isLiked?: boolean;
}

export interface IDemoVote {
    userId: number;
    eventId: string;
    updatedAt: Date;
    voteType: string;
}

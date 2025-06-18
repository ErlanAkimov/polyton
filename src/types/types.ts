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
    creatorNft: ICreatorNft;
    votes: Record<"v1" | "v2", IVote>;
    created_at: string;
    status: string;
    collectedAmount: string;
    category: string[];
    demoVotes: {
        v1: number;
        v2: number;
    };
    myDemoVote: "v1" | "v2" | null;
    isLiked?: boolean;
}

export interface IDemoVote {
    userId: number;
    eventId: string;
    updatedAt: Date;
    voteType: string;
}

export interface ICreatorNft {
    address: string;
    symbol: string;
    collection: number;
    ownerFee: number;
    serviceFee: number;
    firstOwnerFee: number;
    index: number;
}

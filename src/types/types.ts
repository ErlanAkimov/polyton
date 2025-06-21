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
    startV1: string;
    startV2: string;
    finishData?: {
        date: Date;
        winner: string | null;
        totalAmountToSend: number;
        serviceFeeAmount: number;
        firstOwnerFeeAmount: number;
        nftOwnerAmount: number;
    }
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

interface IBaseTransaction {
    id: string;
    validUntil: number;
    status: "pending" | "fraud" | "complete" | "canceled" | "expired";
    hash: string | null;
    completedAt: Date | null;
    walletAddress: string;
    isVote: boolean;
    isFinished?: boolean;
    isWinner?: boolean;
    winningValue?: string;
}

export interface IVoteTransaction extends IBaseTransaction {
    vote: {
        userId: number;
        username?: string;
        eventId: string;
        eventTitle: string;
        eventImage: string;
        createdAt: Date;
        amount: string;
        pickedVote: "v1" | "v2";
    };
    isVote: true;
}

export interface IEventTransaction extends IBaseTransaction {
    event: {
        userId: number;
        username?: string;
        id: string;
        amount: string;
        creator: string;
    };
    isVote: false;
}

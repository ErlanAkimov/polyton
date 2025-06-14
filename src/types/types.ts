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

interface IVotes {
    v1: IVote;
    v2: IVote;
}

export interface IEvent {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    creator: string;
    creator_nft: ICreatorNFT;
    votes: IVotes;
	expires_at: string;
	created_at: string;
	status: string;
	collectedAmount: string;
	category: string[];
	demoVotes: {
		v1: number;
		v2: number;
	}
}

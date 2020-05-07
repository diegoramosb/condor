import tweepy
#override tweepy.StreamListener to add logic to on_status
class stream(tweepy.StreamListener):

    def on_status(self, status):
        print(status.text)

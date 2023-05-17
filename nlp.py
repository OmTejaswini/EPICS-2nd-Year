import spacy
nlp = spacy.load("en_core_web_sm")
import re, datetime
import sys

input_data = sys.stdin.readline().rstrip()
# print(input_data, "  input data")
# print("hello from python")
# input_data = sys.stdin.readline().rstrip()

text = input_data

def extract_keywords(text):
    doc = nlp(text)
    print("This is from doc:", doc)


    # Extract time
    time_keywords = []
    for ent in doc.ents:
        if ent.label_ == "TIME":
            time_keywords.append(ent.text)

    # Extract date
    date_keywords = []
    for ent in doc.ents:
        if ent.label_ == "DATE":
            date_keywords.append(ent.text)
    # day = re.search('\d{4}-\d{2}-\d{2}', text)
    # date = datetime.datetime.strptime(day.group(), '%Y-%m-%d').date()
    # date_keywords.append(date)
    # Extract number of people
    num_people = None
    for token in doc:
        if token.like_num and token.text != "0":
            if num_people is None:
                num_people = int(token.text)
            else:
                # If there are multiple numbers in the text, take the largest one as the number of people
                num_people = max(num_people, int(token.text))

    # Extract extra requirements
    extra_req = []
    extra_req_keywords = ["food", "drinks", "music", "decorations", "cake", "projector", "ac", "Digital Screen"]
    for token in doc:
        if token.lower_ in extra_req_keywords:
            extra_req.append(token.lower_)

    # Extract reason for event
    reason = None
    for sent in doc.sents:
        if "because" in sent.text.lower():
            i = sent.text.rfind('because')
            reason = sent.text[i:]
        elif "for" in sent.text.lower():
            i = sent.text.rfind('for')
            reason = sent.text[i:]
            # reason = sent.text.strip(i)

    return time_keywords, date_keywords, num_people, extra_req, reason


# Example usage
# text = "I want to book a room for 200 people at 7pm on 28/04/2023 because a birthday party. We need projector and ac"
time_keywords, date_keywords, num_people, extra_req, reason = extract_keywords(text)
print("Time keywords:", time_keywords)
print("Date keywords:", date_keywords)
print("Number of people:", num_people)
print("Extra requirements:", extra_req)
print("Reason for event:", reason)